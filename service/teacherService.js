'use strict';


module.exports = function(sequelize) {


 return {
        create: function (req, res) {
            console.log(req.body);
            User.findOne({
              where: { username: req.body.username }}).then(function(user) {
                console.log(user)
                if(user) {
                    return res.json({message: 'username taken'});
                }
                User.create({
                    email    : req.body.email,
                    username : req.body.username,
                    nameLast : req.body.nameLast,
                    nameFirst: req.body.nameFirst,
                    cell     : req.body.cell,
                    password : req.body.password,
                    idTitle  : req.body.idTitle
                }).then(function(user) {
                    bcrypt.genSalt(10, function(err, salt) {
                        if(err) throw err;
                        bcrypt.hash(req.body.password, salt, null, function(err, hash) {
                            if(err) throw err;
                            Creds.create({
                                idUser: user.id, 
                                hash: hash, 
                                salt: salt
                            }).then(function() {
                                res.send(user);
                            })
                        });
                    });
                });
                
            });
        },

        auth: function(req, res){
            User.findOne({
                where: {
                    username: req.body.username
                }
            }).then(function(user){
                if(!user){
                    return res.send("invalid credentials");
                }
                Creds.findOne({
                    where: {
                        idUser: user.id
                    }
                }).then(function(userInfo){
                    bcrypt.compare(req.body.password, userInfo.hash, function(err, isMatch) {
                        if(isMatch){
                            req.session.user = user;
                            return res.send(user);
                        } 
                        return res.send("invalid credentials");
                    });
              
                })
            })
        },


        deauth: function(req, res){
            req.session.user = null;
            console.log(req.session, req.session.user);
            res.send("logout succeeded");
            

        },
        get: function (req, res) {
            User.findAll().then(function (users) {
                console.log('i came from the user service file');
                res.json(users);
            });
        },
        getOne: function (req, res) {
            User.findById(req.params.id).then(function (user) {
                console.log('i came from the user service file');
                res.json(user);
            });
        },
        update: function (req, res) {
            User.findById(req.params.id).then(function (user) {
                user.updateAttributes({
                       email: req.body.email,
                    username: req.body.username,
                    nameLast: req.body.nameLast, 
                   nameFirst: req.body.nameFirst,
                        cell: req.body.cell,
                    password: req.body.password,
                       idTitle: req.body.idtitle
                })
              res.json(user);

            });
        },
        profile: function(req, res) {
            User.findOne({
              where: {
                id: req.params.id
              },
              attributes: ['nameFirst', 'nameLast', 'username', 'email', 'cell'],
              include: [{
                model: skill,
                attributes: ['name']
              }]
            })
            .then(function(user) {
              res.json(user);
            });
        
        },
        deleteUser: function(req, res) {
            var userId = req.user.sub;
            if(req.params.id !== userId){
                return res.status(401).send('You can only delete your own account :)')
            }

            User.delete(userId)
                .then(function(){
                    res.sendStatus(200);
                })
                .catch(function(err){
                    res.status(400).send(err);
                });
        }
    };
}






