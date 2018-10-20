var db =  require("../../hjc_db");

  exports.getProject = function(user_id, project_id, callback) {
    query_str =  'SELECT * FROM projects WHERE author_id = ? AND project_id = ?';
    db.query(query_str, [user_id, project_id], function(err, result){
      return callback(err, result);
    });
  }

  exports.getAllProjects = function(user_id, callback) {
    query_str = 'SELECT * FROM projects WHERE author_id = ?';
    db.query(query_str, [user_id], function(err, result) {
      return callback(err, result);
    });
  }
