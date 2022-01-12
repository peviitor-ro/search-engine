import a from "../axios";

a.get("total/")
    .then(response=>{
        console.log(response.data.total.jobs);
    })