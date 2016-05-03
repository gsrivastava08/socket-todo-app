/**
 * TodoController
 *
 * @description :: Server-side logic for managing todoes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	'Add' : function(req, res){
		
		if (!req.isSocket) {
		    return res.badRequest();
		  }

		var task_str = req.param('task');
		if(task_str){
			var task_st = {task : req.param('task'), completed : 'no'};
			Todo.create(task_st).exec(function (err, data){
				if(!err){
					sails.sockets.broadcast('todoRoom', 'addNew', data);
					res.json(data);

				}
				else
					res.json({error: 'Something went wrong.'});
			});
		}else{
			res.json({'error' : 'Invalid data format'});
		}
	},

	'List' : function(req, res){

		if (!req.isSocket) {
		    return res.badRequest();
		  }
		
		sails.sockets.join(req, 'todoRoom');

		Todo.find().exec(function(err, data){
			if(!err)
				res.json(data);
			else
				res.json({error: 'Something went wrong.'})
		});

	},

	'Complete' : function(req, res){
		
		if (!req.isSocket) {
		    return res.badRequest();
		  }

		var task_id = req.param('task');
		Todo.update({id: task_id},{completed:'yes'}).exec(function(err, updated){

		  if (err) {
		    res.json({error: 'Something went wrong.'});
		  }else{
		  	sails.sockets.broadcast('todoRoom', 'taskDone', updated);
		  	res.json(updated);
		  }
		});

	}

};

