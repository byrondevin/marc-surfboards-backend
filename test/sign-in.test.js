import request from 'express';
import {expect} from 'chai';



//Testing sign-in function that makes request to express server. If responds with object, the user is signed in successfully
describe('sign in', function() { 
    it('sign in request', async function(done){ 
        request('http://localhost:5000/sign-in', {email: 'e@e', password: 'e'},
            function(error, response, body){
                expect(response).to.be.an('object');
                
            });

        done();
            
    });
     
});