//schema表格设计
//Post(title,body,category,author,slug,published,meta,comments,created)
//Category(name,slug,created)
//User(name,email,password,created)
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var CategorySchema = new Schema({
  name: {type:String,required:true},
  slug: {type:String,required:true},
  created: {type:Date,default:new Date(),required:true}
});


CategorySchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model('Category', CategorySchema);

