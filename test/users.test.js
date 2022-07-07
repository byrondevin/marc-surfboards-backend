import request from 'express';
import {expect} from 'chai';


//Testing fetch users function. If responds with array, the fetch was successfull

describe('get all users from mongo db', function() { 
    it('recieved user data from get request to /users', async function(done){ 
        request('http://localhost:5000/users',
            function(error, response, body){
                console.log(response);
                expect(response).to.be.a('array');
                
            });

        done();
            
    });
     
});