const { writeFile } = require('fs')
const path = require('path')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");

const params = {
    "region": "us-east-1",
    "credentials": {
        "accessKeyId": process.env["AWS_ACCESS_KEY_ID"],
        "secretAccessKey": process.env["AWS_SECRET_ACCESS_KEY"],
    }
};

const client = new S3Client(params)

async function uploadFileS3(filename, data) {
    /**
     * @param filename the file
     */

    const command = new PutObjectCommand({
        Bucket: process.env["AWS_BUCKET"],
        Key: filename,
        Body: data,
    })

    try {
        await client.send(command)
        const url = await getSignedUrl(client, command, { expiresIn: 3600 });
    } catch (error) {
        console.error(error)
    }
}

async function downloaddFileS3(filename) {

    const command = new GetObjectCommand({
        Bucket: process.env["AWS_BUCKET"],
        Key: filename,
    })

    try {
        const response = await client.send(command)
        const data = await response.Body.transformToString()
        await writeFile(path.join(__dirname, '..', '..', 'downloads', filename), data, 'utf-8', (error) => {
            if (error)
                throw new Error
        })
    } catch (error) {
        console.error(error)
    }


}

module.exports = {
    uploadFileS3,
    downloaddFileS3
}
