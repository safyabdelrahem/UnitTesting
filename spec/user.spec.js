const request = require("supertest");
const app = require("..");
const { clearDatabase } = require("../db.connection");
const{saveUser, getAllUser, getUserByName,deleteAllUsers,getUserById,login}=require('../controllers/user')


const req = request(app);

describe("Test User Routes", () => {
  afterAll(async () => {
    await clearDatabase();
  });
  beforeAll(() => {
    process.env.SECRET = "this-is-my-jwt-secret";
  });
  let mockUser = { name: "amira", email: "asd@gmail.com", password: "123" };
  let userInDb;
  it("expect get(/) to res with all users", async () => {
    let res = await req.get("/user/");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(0);
  });
//   it("expect when calling get(/user/) to have an empty array of users in response", async () => {
//     let res = await req.get("/user/");
//     expect(res.status).toBe(200);
//     expect(res.body.data).toHaveLength(0);  
// });

  it("expect post(/signup) and valid user then get res correctly", async () => {
    let res = await req.post("/user/signup").send(mockUser);
    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe(mockUser.name);
    // console.log(res.body.data);
    userInDb=res.body.data;
  });
  it("expect get(/) to res with all users", async () => {
    let res = await req.get("/user/");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1); 
  });
  it("expect post(/login) with valid user to login successfuly", async () => {
    let res = await req.post("/user/login").send(mockUser);
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });
  it("expect post(/login) with invalid user to send Invalid email or password'", async () => {
    let res = await req.post("/user/login").send({name:'ramy',email:'ramy@gmail.com',password:'asd'});
    expect(res.status).toBe(401);
    expect(res.body.message).toContain('Invalid')
  });

  it('expect get(/user/:id) to get spacific user',async()=>{
      console.log(userInDb);
      let res=await req.get('/user/'+userInDb._id);
      expect(res.status).toBe(200)
      expect(res.body.data.password).toBe(userInDb.password)
  })






 

const userModel = require('../models/user');


jest.mock('../models/user', () => ({
  findOne: jest.fn(),
  deleteMany: jest.fn()
}));
const res = {
  status: jest.fn(() => res),
  json: jest.fn()
};

// Define the test suite using describe
describe('Users Routes:', () => {
  // Mock request objects
  let req;

  beforeEach(() => {
    req = { query: {} };
    jest.clearAllMocks(); // Clear mock function calls between tests
  });

  // Test case for getting a user by name
  it('should get a user by name if exists', async () => {
    const expectedParameter = expect.objectContaining({ name: 'John Doe' });
    req.query.name = 'John Doe';
    const mockUser = { _id: 'mockUserId', name: 'John Doe' };
    userModel.findOne.mockResolvedValueOnce(mockUser);
    await getUserByName(req, res);

    expect(userModel.findOne).toHaveBeenCalledWith(expectedParameter);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: mockUser });
  });

  it('should return a message if no user with the given name exists', async () => {
    req.query.name = 'Nonexistent User';
    const expectedParameter = expect.objectContaining({ name: 'Nonexistent User' });
    userModel.findOne.mockResolvedValueOnce(null);

    await getUserByName(req, res);

    expect(userModel.findOne).toHaveBeenCalledWith(expectedParameter);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'There is no user with name: Nonexistent User' });
  });

  it('should handle errors when getting a user by name', async () => {
    req.query.name = 'Invalid User';
    const errorMessage = 'Error finding user';
    userModel.findOne.mockRejectedValueOnce(new Error(errorMessage));

    await getUserByName(req, res);

    expect(userModel.findOne).toHaveBeenCalledWith({ name: 'Invalid User' });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
  });

  // Test case for deleting all users
  it('should delete all users successfully', async () => {
    await deleteAllUsers(req, res);

    expect(userModel.deleteMany).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'users have been deleted successfully' });
  });

  it('should handle errors when deleting all users', async () => {
    const errorMessage = 'Error deleting users';
    userModel.deleteMany.mockRejectedValueOnce(new Error(errorMessage));

    await deleteAllUsers(req, res);

    expect(userModel.deleteMany).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
  });
});

});
