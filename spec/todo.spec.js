const request = require("supertest");
const app = require("..");
const { clearDatabase } = require("../db.connection");

const req = request(app);

fdescribe("Test Todo Routes", () => {
  let userInDb;
  let token;
  let todoinDb
  afterAll(async () => {
    await clearDatabase();
  });
  beforeAll(async () => {
    process.env.SECRET = "this-is-my-jwt-secret";
    let mockUser = { name: "amira", email: "asd@gmail.com", password: "123" };
    let res1 = await req.post("/user/signup").send(mockUser);
    userInDb = res1.body.data;
    let res2 = await req.post("/user/login").send(mockUser);
    token = res2.body.token;
  });
  it("expect get(/) to res with all todos", async () => {
    let res = await req.get("/todo/");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveSize(0);
  });
  it('expect post(/todo/) to add a todo successfully', async()=>{
     let res=await req.post('/todo/').send({title:'do Tasks'}).set({authorization:token})
     expect(res.status).toBe(201)
     todoinDb=res.body.data
  })
  it("expect get(/todo/:id) to get todo correctly",async()=>{
     let res=await req.get('/todo/'+todoinDb._id).set({authorization:token});
     expect(res.body.data.title).toContain('Tasks')
  })
  it("expect get(/todo/:id) to return message  please login first if notauthorized  ",async()=>{
     let res=await req.get('/todo/'+todoinDb._id)
     expect(res.body.message).toContain('please login first')
  })

  it("expect get(/todo/) to delete all todos correctly",async()=>{
    let res=await req.delete('/todo/').set({authorization:token});
    expect(res.body.message).toContain('todos have been deleted successfully')
 })





 
const { updateTitleTodoById, getUserTodos, deleteAllTodos } = require('../controllers/todo'); 
const todosModel = require('../models/todos');

// Mocking the todosModel and response objects
jest.mock('../models/todos', () => ({
  findOneAndUpdate: jest.fn(),
  find: jest.fn(),
  deleteMany: jest.fn()
}));
const res = {
  status: jest.fn(() => res),
  json: jest.fn()
};

// Define the test suite using describe
describe('Todos Routes:', () => {
  // Mock request objects
  let req;

  beforeEach(() => {
    req = { params: {}, body: {}, id: 'mockUserId' };
    jest.clearAllMocks(); 
  });

  // Test case for updating todo title by ID
  it('should update todo title by ID', async () => {
    req.params.id = 'mockTodoId';
    req.body.title = 'Updated Title';
    const mockUpdatedTodo = { _id: 'mockTodoId', title: 'Updated Title' };
    todosModel.findOneAndUpdate.mockResolvedValueOnce(mockUpdatedTodo);

    await updateTitleTodoById(req, res);

    expect(todosModel.findOneAndUpdate).toHaveBeenCalledWith({ _id: 'mockTodoId' }, { title: 'Updated Title' }, { new: true });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: mockUpdatedTodo });
  });

  it('should handle errors when updating todo title by ID', async () => {
    req.params.id = 'invalidTodoId';
    req.body.title = 'Updated Title';
    const errorMessage = 'Error updating todo title';
    todosModel.findOneAndUpdate.mockRejectedValueOnce(new Error(errorMessage));

    await updateTitleTodoById(req, res);

    expect(todosModel.findOneAndUpdate).toHaveBeenCalledWith({ _id: 'invalidTodoId' }, { title: 'Updated Title' }, { new: true });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
  });

  // Test case for getting user's todos
  it('should get all user\'s todos', async () => {
    const mockTodos = [{ _id: 'todo1', title: 'Task 1' }, { _id: 'todo2', title: 'Task 2' }];
    todosModel.find.mockResolvedValueOnce(mockTodos);

    await getUserTodos(req, res);

    expect(todosModel.find).toHaveBeenCalledWith({ userId: 'mockUserId' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: mockTodos });
  });

  it('should handle case when user has no todos', async () => {
    todosModel.find.mockResolvedValueOnce([]);

    await getUserTodos(req, res);

    expect(todosModel.find).toHaveBeenCalledWith({ userId: 'mockUserId' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Couldn't find any todos for mockUserId" });
  });

  it('should handle errors when getting user\'s todos', async () => {
    const errorMessage = 'Error getting user\'s todos';
    todosModel.find.mockRejectedValueOnce(new Error(errorMessage));

    await getUserTodos(req, res);

    expect(todosModel.find).toHaveBeenCalledWith({ userId: 'mockUserId' });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
  });

  // Test case for deleting all todos
  it('should delete all todos successfully', async () => {
    await deleteAllTodos(req, res);

    expect(todosModel.deleteMany).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'todos have been deleted successfully' });
  });

  it('should handle errors when deleting all todos', async () => {
    const errorMessage = 'Error deleting todos';
    todosModel.deleteMany.mockRejectedValueOnce(new Error(errorMessage));

    await deleteAllTodos(req, res);

    expect(todosModel.deleteMany).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
  });
});




});
