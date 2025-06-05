const mongoose = require('mongoose');
const moment = require('moment');

const featuresSchema = new mongoose.Schema({
    _id: { type: String },
    name: {
        type: String,
        required: true
    },
    
    embedding_vector: {
        type: [Number],
        required: true
    }
}, { timestamps: true });

featuresSchema.set('toJSON', {
    transform: function (doc, ret) {
        const formatted = {
            _id: ret._id,
            name: ret.name,
            description: ret.description,
            embedding_vector: ret.embedding_vector,
            createdAt: moment(ret.createdAt).format('DD/MM/YYYY HH:mm:ss'),
            updatedAt: moment(ret.updatedAt).format('DD/MM/YYYY HH:mm:ss')
        };
        delete ret._id;
        delete ret.__v;
        return formatted;
    }
});

const Features = mongoose.model('Features', featuresSchema);
module.exports = Features;
