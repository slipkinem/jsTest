//schema表格设计
//Post(title,body,category,author,slug,published,meta,comments,created)
//Category(name,slug,created)
//User(name,email,password,created)
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var PostSchema = new Schema({
  title: {type:String,required:true},
  content: {type:String,required:true},
  category: {type:Schema.Types.ObjectId,ref:'Category'},
  author: {type:Schema.Types.ObjectId,ref:'User'},
  slug: {type:String,required:true},
  published: {type:Boolean,required:true},
  meta: {type:Schema.Types.Mixed,required:true},
  comments: [Schema.Types.Mixed],
  created: {type:Date,default:new Date(),required:true}
});


PostSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model('Post', PostSchema);



