const axiosURL = require("../axios");

exports.uploadProfilePic = function (req, res) {
    try {
        const file = req.file;
        let returnObj = {};

        if (file) {
            returnObj = res.status(201).json({
                status: true,
                message: "File uploded successfully",
                formData: { ...req.body, profilePic: req.file.path },
            });
        } else {
            returnObj = res.status(201).json({
                status: true,
                message: "File uploded successfully",
                formData: { ...req.body, profilePic: "uploads/user.png" },
            });
        }

        // Send Data to Graphql
        axios({
            url: axiosURL + "/graphql",
            method: "post",
            data: {
                mutation: `
                    mutation{
                            register(registerInput: {
                            username: ${req.body.username}
                            password:  ${req.body.password}
                            confirmPassword: ${req.body.password}
                            email: ${req.body.password}
                            name: ${req.body.password}
                            profilePic: ${req.file.path}
                        })
                        {
                            id username createdAt name profilePic token 
                        }
                    }
                `,
            },
        }).then((result) => {
            console.log("Here");

            return "Success";
        });
        console.log("done");
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "File upload Failed",
            error: error,
        });
    }
};
