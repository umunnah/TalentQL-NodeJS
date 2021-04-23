const cloudinary = require("cloudinary");
const ErrorResponse = require("./errorResponse");
const dotenv = require('dotenv');
dotenv.config({path : './.env'});

const Q = require("q");

cloudinary.config({
    cloud_name: process.env.CLOUNDINARY_NAME,
    api_key: process.env.CLOUNDINARY_API_KEY,
    api_secret: process.env.CLOUNDINARY_API_SECRET
});

class file_management {

    constructor(file) {
        this.file = file
    }

    upload() {
        return new Q.Promise((resolve, reject) => {
            cloudinary.v2.uploader.upload(this.file, { width: 850, height: 400 }, (err, res) => {
                if (err) {
                  return next(new ErrorResponse(err, 400));
                    reject(err);
                } else {
                    return resolve(res.url);
                }
            }).catch(e => {});
        });
    }

    delete() {
        const deleteimage = async() => {
            await cloudinary.uploader.destroy(
                "e0gbgemwsj4xgxf1vgav", { invalidate: true, resource_type: "raw" },
                function(err, res) {
                    if (err) {
                        console.log(err);
                    }
                    console.log(res);
                }
            )
        }
    }
}

module.exports = file_management;