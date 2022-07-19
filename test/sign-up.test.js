import request from 'express';
import {expect} from 'chai';



//Testing sign-up function that makes request to express server. If responds with object, the user is signed up successfully


describe('signup', function() { 
    it('sign up request', async function(done){ 
        request('http://localhost:5000/sign-up', {email: 'm@m', password: 'm', admin:false},
            function(error, response, body){

                expect(response).to.be.an('object');
                
            });

        done();
            
    });
     
});