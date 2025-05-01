 users: [{name:"",email:"",_id:""},{name:"",email:"",_id:""}],
 results:[{
_id:"",
projectreview:"" ,//out of 10
viva:"", //out of 5
finalprojectreview:"", //out of 30
finalviva:"", //out of 5
attendance:"", //out of 5
socialmediasharing:"", //out of 5
totalmarks:"", //out of 60
 }]
  
  status:{type:String,required:true},
  batchid:{type:Schema.Types.ObjectId,required:true,ref:'Batch'},
  users: [{name:"",email:"",_id:""},{name:"",email:"",_id:""}],
  results:[{
 _id:"",
 projectreview:"" ,//out of 10
 viva:"", //out of 5
 finalprojectreview:"", //out of 30
 finalviva:"", //out of 5
 attendance:"", //out of 5
 socialmediasharing:"", //out of 5
 totalmarks:"", //out of 60
  }]