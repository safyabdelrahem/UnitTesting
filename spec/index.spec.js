const request = require('supertest');
const app=require('..')
const clearDatabase = async () => {
    try {
        await YourDatabaseModel.deleteMany();
        console.log('Database cleared successfully');
    } catch (error) {
        console.error('Error clearing database:', error);
    }
};

const req=request(app)
describe('Test default route', () => {
    it('expect when calling get(/) to have an empty todos array in response', async () => {
        let res = await req.get('/');
        console.log(res.body);
        expect(res.status).toBe(200);
        expect(res.body.todos).toHaveLength(0); 
    });
});
module.exports = clearDatabase;