import './results.style.scss';
import { job } from '../job/job.component.js';
import a from "../../axios";
import {state} from "../../state";
import {query} from "../../variables/queryVariables";
// import {filter} from "../filter/filter.component";

export const results = () => {
  const results = document.createElement('div');
  const showResult=document.createElement('p');
  showResult.id="resultt"


  results.classList = 'results';




    const url_string = window.location.href
    const url = new URL(url_string);
    const q = url.searchParams.get("q");
    const page = url.searchParams.get("page");

// const city= "Cluj";
// const company="Yonder";

//
// function generateQueryString(){
//     let queryString="";
//
//     if(state[query.q]!=null){
//         queryString+= state[query.q];
//
//     }
//     else if((state[query.company]!=null)){
//         queryString+= state[query.company];
//     }
//
//     else if((state[query.city]!=null)){
//         queryString+= state[query.city];
//     }
//     else if((state[query.country]!=null)){
//         queryString+= state[query.country];
//     }
//
//     else if((state[query.page]!=null)){
//         queryString+= state[query.page];
//     }
//     console.log(queryString)
//     return queryString
// }



function search() {
        // q=tester&city=some20%city&company=company&page=3
if(page !=null) {
    a.get(`search/?q=${q}&page=${page}`)
        .then(response => {

            let jobs = [];
            const data = response.data.response.docs
            console.log(response.data.response.numFound);
            data.map((value) => {
                let obj = {url: "", title: "", company: "", city: ""};

                obj.url = value.job_link[0];
                obj.title = value.job_title[0];
                obj.company = value.company[0];
                obj.country = value.country[0];
                obj.city = value.city[0];

                jobs.push(obj);
            })

            jobs.forEach(j => {
                const newJob = job(j);
                results.appendChild(newJob);


            })

        })
}
else
{
    a.get(`search/?q=${q}`)
        .then(response => {

            let jobs = [];
            const data = response.data.response.docs
            data.map((value) => {
                let obj = {url: "", title: "", company: "", city: ""};

                obj.url = value.job_link[0];
                obj.title = value.job_title[0];
                obj.company = value.company[0];
                obj.country = value.country[0];
                obj.city = value.city[0];

                jobs.push(obj);
            })

            jobs.forEach(j => {
                const newJob = job(j);
                results.appendChild(newJob);


            })

        })
}

}

  const jobs = [
    {
      url:'www.google.com',
      title: 'This is a job',
      company: 'Endava',
      country: 'Romania',
      city: 'Cluj'
    },
    {
      url: 'www.google.com',
      title: 'This is a job',
      company: 'Endava',
      country: 'Romania',
      city: 'Cluj'
    },
    {
      url: 'www.google.com',
      title: 'This is a job',
      company: 'Endava',
      country: 'Romania',
      city: 'Cluj'
    },
  ]

  // jobs.forEach(j => {
  //   const newJob = job(j);
  //   // results.appendChild(newJob);
  //
  // })

    search()
  return results;
}