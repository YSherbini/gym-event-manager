import mongoose from "mongoose";
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
});
categorySchema.methods.toJSON = function () {
    const category = this;
    const categoryObject = category.toObject();
    delete categoryObject.__v;
    return categoryObject;
};
const Category = mongoose.model('Category', categorySchema);
export default Category;
//# sourceMappingURL=category.js.map