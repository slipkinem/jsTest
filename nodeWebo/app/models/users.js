//schema表格设计
//Post(title,body,category,author,slug,published,meta,comments,created)
//Category(name,slug,created)
//User(name,email,password,created)
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var UsersSchema = new Schema({
  name: {type:String,required:true},
  email: {type:String,required:true},
  password: {type:Schema.Types.ObjectId,required:true},
  created: {type:Date,default:new Date(),required:true}
});


UsersSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model('User', UsersSchema);

