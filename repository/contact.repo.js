const contactModel = require('../models/contact.model');

class ContactRepository {
    async createContact(data){
        try{
            const contact = await contactModel.create(data);
            return contact;
        }catch(error){
            throw error;
        }
    }
    async getAllContacts(){
        try{
            const contacts = await contactModel.find({ isDeleted: false })
            return contacts;
        }catch(err){
            throw err;
        }
    }
    async getContactById(id){
        try{
            const contact = await contactModel.findById(id)
            return contact;
        }catch(err){
            throw err;
        }
    }
    async updateContact(id, data){
        try{
            const contact = await contactModel.findByIdAndUpdate(id, data, {new: true});
            return contact;
        }catch(err){
            throw err;
        }
    }
    async deleteContact(id){
        try{
            const contact = await contactModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
            return contact;
        }catch(err){
            throw err;
        }
    }
}

module.exports = new ContactRepository();