const express = require("express")
const router = express.Router();
const application = express();
const axios = require("axios");
const _ = require("lodash");

// Why you are adding express.json()
application.use(express.json());
application.use(express.urlencoded({ extended: true }));

// Method 1
const request = require('request');

//Method 2
var unirest = require('unirest');

const cors = require('cors');


// Cross Origin Resource sharing - Allowing request from another website/domain
application.use(cors())

//*****************************************************************************************************************************************
// http://localhost:9999/api/ping
application.get('/api/ping',function (req,res)
    {
        // External API  -  saving in a seperate variable
        var urll = "https://api.hatchways.io/assessment/blog/posts?tag=tech"
        request({url:urll,json:true},function(error,response)
            {
                if(error)
                {
                    res.send("Failed to Fetch")
                }
                else
                {
                    //res.send({"success": response ? true : false})
                    res.status(200).json({success:"true"})
                }
            }
        )
    }
)

//*****************************************************************************************************************************************
// http://localhost:9999/api/posts?tags=science,text
// Default value for sortBy = id  && direction = asc

// Possible Combinations/Permutations of URL
// http://localhost:9999/api/posts?tags=science,text&sortBy=popularity&direction=asc
// http://localhost:9999/api/posts?tags=science,text&sortBy=id&direction=asc
// http://localhost:9999/api/posts?tags=science,text&sortBy=reads&direction=asc
// http://localhost:9999/api/posts?tags=science,text&sortBy=likes&direction=asc

// http://localhost:9999/api/posts?tags=science,text&sortBy=popularity&direction=desc
// http://localhost:9999/api/posts?tags=science,text&sortBy=id&direction=desc
// http://localhost:9999/api/posts?tags=science,text&sortBy=reads&direction=desc
// http://localhost:9999/api/posts?tags=science,text&sortBy=likes&direction=desc

application.get('/api/posts',async(req,res)=>
{
    // Global Variables

    let posts = [];
    let tags = "";
    let requests = "";

    try
    {
        tags = getTagsArray(req.query.tags);
    }
    catch(e)
    {
        res.status(400).json({error:"Tags paremeter is required"})
    }

    try
    {
        //Concurrent API Calls
        requests = tags.map( (tagObjVar) =>
            {
                console.log(tagObjVar)
                const dummyResultOfAxios =   axios.get("https://api.hatchways.io/assessment/blog/posts?tag="+tagObjVar)
                // console.log(JSON.parse(JSON.stringify(dummyResultOfAxios.data)));
                return dummyResultOfAxios
                //console.log(temp)
            }
        );
    }
    catch(err)
    {
        res.send(err)
    }

    // console.log(requests);
    // const result = await Promise.all(requests);
    // console.log(JSON.parse(JSON.stringify(result[0].data)));

    try
    {
        // console.log(requests)
        const result = await Promise.all(requests);
        result.map((item) =>
        {
            posts = addNewPosts(posts,item.data.posts);
        });

        // process.on('unhandledRejection', (reason, promise) =>
        // {
        //     console.log(result)
        // });

    } catch(err)
    {
        res.status(500).json({error: String(err)});
    }

    //return res.send({posts: posts});

    // sortBy using "id"
    var sortBy = (req.query.sortBy)
    var direction = (req.query.direction)

    // If we pass query param direction other than desc or asc
    // if we pass query paarem dierction with some random numbers
    if(direction != null && direction != "desc" && direction != "asc")
    {
        // Bad Request Error
        res.status(400).json({error:"direction parameter is invalid"})
    }
    else if(direction != null && direction == "desc") // If direction is desc
    {
        if(sortBy != null && sortBy != "id" && sortBy != "popularity" && sortBy != "reads" && sortBy != "likes")
        {
            res.status(400).json({error:"sortBy parameter is invalid"})
        }
        if(sortBy == "popularity")
        {
            posts.sort((object1,object2) => object2.popularity - object1.popularity)
            console.log(posts)
            res.status(200).send(posts)
        }

        else if(sortBy == "reads")
        {
            posts.sort((object1,object2) => object2.reads - object1.reads)
            console.log(posts)
            res.status(200).send(posts)
        }

        else if(sortBy == "likes")
        {
            posts.sort((object1,object2) => object2.likes - object1.likes)
            console.log(posts)
            res.status(200).send(posts)
        }
        else // Default sortBy value is "id"
        {
            posts.sort((object1,object2) => object2.id - object1.id)
            console.log(posts)
            res.status(200).send(posts)
        }
    }
    else // Default direction - asc
    {
        if(sortBy != null && sortBy != "id" && sortBy != "popularity" && sortBy != "reads" && sortBy != "likes")
        {
            res.status(400).json({error:"sortBy parameter is invalid"})
        }

        if(sortBy == "popularity")
        {
            posts.sort((object1,object2) => object1.popularity - object2.popularity)
            console.log(posts)
            res.status(200).send(posts)
        }
        else if(sortBy == "reads")
        {
            posts.sort((object1,object2) => object1.reads - object2.reads)
            console.log(posts)
            res.status(200).send(posts)
        }
        else if(sortBy == "likes")
        {
            posts.sort((object1,object2) => object1.likes - object2.likes)
            console.log(posts)
            res.status(200).send(posts)
        }
        else // Default sortBy value is "id"
        {
            posts.sort((object1,object2) => object1.id - object2.id)
            console.log(posts)
            res.status(200).send(posts)
        }
    }
})

function getTagsArray(tags)
{

    const tagsArray = tags.split(",");
    const tagArrayLength = tagsArray.length

    for (var i = 0; i < tagArrayLength; i++)
    {
        tagsArray[i] = tagsArray[i].trim();
    }

    return tagsArray;
}

function addNewPosts(oldPosts, newPosts)
{
    let isAlreadyAvailable;

    for (let i = 0; i < newPosts.length; i++)
    {
        isAlreadyAvailable = false;

        for (let j = 0; j < oldPosts.length; j++)
        {
            if (_.isEqual(oldPosts[j], newPosts[i]))
            {
                isAlreadyAvailable = true;
                break;
            }
        }

        // add a post to old posts only if it already has not added
        if (!isAlreadyAvailable)
        {
            oldPosts.push(newPosts[i]);
        }
    }

    return oldPosts;
}
//*****************************************************************************************************************************************
// Setting the local server port number.
application.listen(9999), function ()
{
    console.log("Server listening at the port 9999.............")
}

