var connection = require('./db');
//connection.connect();
var Task={

getAlldata:function(callback){

return connection.query("Select * from Master_Table where Status='Pending'",callback);

},
getType:function(callback){

return connection.query("Select * from category",callback);

},
getData:function(Task,callback){

  //Select e.CompanyEmployeeId,u.UserName,u.UserPassword,u.Email from  useraccount as u inner join employee e on e.Id=u.EmployeeId  where  UserName like '%shadab%'

//return connection.query("Select EmployeeId,UserName,UserPassword,Email from  useraccount where  UserName like '"+Task+"%'",callback);
return connection.query("Select e.CompanyEmployeeId,u.EmployeeId,u.UserName,u.UserPassword,u.Email from  useraccount as u inner join employee e on e.Id=u.EmployeeId  where  UserName like '"+Task+"%'",callback);
},
getAdmin:function(Task,callback){

return connection.query("select count(*) as c FROM employee where ManagerId="+Task,callback);

},
getProject:function(callback){

return connection.query("SELECT Id,Name FROM project",callback);

},
updateStatus:function(id,status,comment,callback){
  var sql;
if(status==1)
{
  sql="update expensesheet set ReceiptVerified='Y',SheetStatus='Closed' where Id="+id;
}
else{
  sql="update expensesheet set ReceiptVerified='Y',SheetStatus='Denied',RejectionReason='"+comment+"' where Id="+id;
}
console.log(sql);
return connection.query(sql,callback);

},
getNextId:function(data,callback){
// console.log("SELECT `auto_increment` FROM INFORMATION_SCHEMA.TABLES WHERE table_name = '"+data+"'");
return connection.query("select Id from "+data+" order by id desc limit 1",callback);

},
getApprover:function(Task,callback){

//return connection.query("select ManagerId from employee where Id="+Task,callback);
return connection.query("select ManagerId from employee where Id="+Task,callback);

},
getExpense:function(Task,callback){

return connection.query("select * from expensesheet where EmployeeId="+Task,callback);

},
getExpenseInfo:function(Task,callback){

//return connection.query(`select expense.ExpenseSheetId,expense.id,expense.createdby,expense.Amount,expense.Description,expense.FromDate,expense.todate from expensesheetlinerecord as expense inner join expensesheet as el on el.Id=expense.ExpenseSheetId
//inner join project as p on p.Id=el.ProjectId inner join category as cat on cat.Id=expense.CategoryId where ExpenseSheetId=`+Task,callback);
return connection.query(`select expense.ExpenseSheetId,el.EmployeeId,cat.Value,el.SheetName,expense.id,expense.createdby,expense.Amount,expense.Description,expense.FromDate,expense.todate from expensesheetlinerecord as expense inner join expensesheet as el on el.Id=expense.ExpenseSheetId
inner join project as p on p.Id=el.ProjectId inner join category as cat on cat.Id=expense.CategoryId where ExpenseSheetId=`+Task,callback);

},
getApprovername:function(Task,callback){

return connection.query("select * from employee where Id="+Task,callback);

},
getCemplid:function(Task,callback){

  return connection.query("select * from employee where Id="+Task,callback);
  
  },
getApproverInfo:function(Task,callback){

return connection.query("select * from expensesheet where Approver="+Task,callback);

},
getSheetName:function(Task,callback){

return connection.query("select SheetName from expensesheet where Id="+Task,callback);

},
CheckForSheet:function(Task,callback){
console.log(Task);
return connection.query("select count(*) as c from expensesheet where SheetName='"+Task+"'",callback);

},
checkForExpId:function(Task,callback){

return connection.query("select Id  from expensesheet where SheetName='"+Task+"'",callback);

},
insertData:function(Task,callback){
  //console.log("insert into Master_Table values('',"+Task.data1+","+Task.data6+","+Task.data5+","+Task.data7+","+Task.data2);
  return connection.query("insert into Master_Table values(?,?,?,?,?,?,?,?,?,?,?,?)",["",Task.data1,Task.data6,Task.data5,"",Task.data7,Task.data2,"","Pending",Task.data4,"",Task.data3],callback);
},
insertExpense:function(Task,flag,callback){
  //console.log("insert into Master_Table values('',"+Task.data1+","+Task.data6+","+Task.data5+","+Task.data7+","+Task.data2);
//console.log(JSON.stringify(Task));
var sql="INSERT INTO expensesheet(`EmployeeId`,`SheetName`,`SheetStatus`,`ProjectId`,`Purpose`,`TotalAmount`,`ReceiptReceived`,`CreatedBy`,`CreatedOn`,`Approver`) values"+`(${Task.Eid},'${Task.sheetid}','Pending',${Task.ptype},'${Task.purpose}',${Task.expense},'Y','${Task.user}',now(),${Task.managerid})`

connection.query(sql);

var sql ="select Id from expensesheet order by id desc limit 1";

return connection.query(sql,callback);
//co


  //return connection.query("insert into Master_Table values(?,?,?,?,?,?,?,?,?,?,?,?)",["",Task.data1,Task.data6,Task.data5,"",Task.data7,Task.data2,"","Pending",Task.data4,"",Task.data3],callback);
},
insertExpenseline:function(Task,flag,callback){
  //console.log("insert into Master_Table values('',"+Task.data1+","+Task.data6+","+Task.data5+","+Task.data7+","+Task.data2);
//console.log(JSON.stringify(Task));
var sql="INSERT INTO expensesheetlinerecord(`ExpenseSheetId`,`DateExpenseOccured`,`CategoryId`,`Amount`,`Description`,`CreatedBy`,`CreatedOn`,`FromDate`,`ToDate`) values"+`(${flag},now(),${Task.cat},${Task.expense},'${Task.comment}','${Task.user}',now(),'${Task.sdate}','${Task.edate}')`;

connection.query(sql);
var sql =`update expensesheet set TotalAmount=(select sum(Amount) from expensesheetlinerecord where ExpenseSheetId=${flag}) where Id=${flag}`;
connection.query(sql);

}

/*,
 getTaskById:function(id,callback){

return db.query("select * from task where Id=?",[id],callback);
 },
 addTask:function(Task,callback){
 return db.query("Insert into task values(?,?,?)",[Task.Id,Task.Title,Task.Status],callback);
 },
 deleteTask:function(id,callback){
  return db.query("delete from task where Id=?",[id],callback);
 },
 updateTask:function(id,Task,callback){
  return db.query("update task set Title=?,Status=? where Id=?",[Task.Title,Task.Status,id],callback);
}*/

};

module.exports=Task
