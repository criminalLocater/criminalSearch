const contactRepository = require("../repository/contact.repo");

class ContactController {
    async createContact(req, res) {
        try {
            const { name, email, message } = req.body;
            if (!name || !email || !message) {
                return res
                    .status(400)
                    .json({ message: "All fields are required" });
            }
            const contact = await contactRepository.createContact({
                name,
                email,
                message,
            });
            res.status(201).json({
                message: "Contact created successfully",
                data: contact,
            });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error",
                error: err.message,
            });
        }
    }
    async getAllContacts(req, res) {
        try {
            const { page = 1, limit = 5 } = req.query;

            const contacts = await contactRepository.getAllContacts(page,limit);
            res.status(200).json({
                message: "Contacts retrieved successfully",
                data: contacts,
            });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server error",
                error: err.message,
            });
        }
    }
    async getContactbyId(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res
                    .status(400)
                    .json({ message: "Contact ID is required" });
            }
            const contact = await contactRepository.getContactById(id);
            if (!contact) {
                return res.status(404).json({ message: "Contact not found" });
            }
            res.status(200).json({
                message: "Contact retrieved successfully",
                data: contact,
            });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error",
                error: err.message,
            });
        }
    }
    async updateContact(req, res) {
        try {
            const { id } = req.params;
            const { name, email, message } = req.bopdy;
            if (!id) {
                return res
                    .status(400)
                    .json({ message: "Contact ID is required" });
            }
            const contact = await contactRepository.updateContact(id, {
                name,
                email,
                message,
            });
            if (!contact) {
                res.status(404).json({ message: "Contact not found" });
            }
            res.status(200).json({
                message: "Contact updated successfully",
                data: contact,
            });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error",
                error: err.message,
            });
        }
    }
    async deleteContact(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res
                    .status(400)
                    .json({ message: "Contact ID is required" });
            }
            const contact = await contactRepository.deleteContact(id);
            if (!contact) {
                return res.status(404).json({ message: "Contact not found" });
            }
            res.status(200).json({
                message: "Contact deleted successfully",
                data: contact,
            });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error",
                error: err.message,
            });
        }
    }
}
module.exports = new ContactController();
