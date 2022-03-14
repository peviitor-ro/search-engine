import "./pagination.style.scss";

export const pagination = () => {

    function page(number) {
        const urltext = window.location.href;
        let url = new URL(urltext);
        url.searchParams.set("page", number);

        return url.search
    }

    function pageMax() {



    let resultsNumber = 91

    return (Math.ceil(
        resultsNumber / 10))

    // console.log(pageMax())
}

// console.log(currentPage())
    let startPage=1;

    const test = document.createElement('div');



    for (startPage = 1; startPage <=pageMax() ; startPage++) {

        //add page number to href
        test.innerHTML+=`<a  href="${page(startPage)}" id="page_${startPage}" }">${startPage}</a`;


    }

   function nextPage(){
       const button= document.createElement("button")
       button.innerText="next";
       button.classList="nextButton";

       let qs = new URLSearchParams(window.location.search);
       const current = qs.get("page");
       const getQ=qs.get("q");

       button.onclick=function (){

           const nextPage=parseInt(current)+1;

           const url=window.location.href=`rezultate?q=${getQ}&page=${nextPage}`;
           console.log(url)


       }

       test.appendChild(button)
   }
    prevPage()
    nextPage()

    function prevPage(){
        const button= document.createElement("button")
        button.innerText="prev";
        button.classList="prevButton";

        let qs = new URLSearchParams(window.location.search);
        const current = qs.get("page");
        const getQ=qs.get("q");

        button.onclick=function (){

            const nextPage=parseInt(current)-1;

            const url=window.location.href=`rezultate?q=${getQ}&page=${nextPage}`;
            console.log(url);


        }

        // const newUrl=window.location.search=`&page=${nextP}`
        test.appendChild(button)
    }



    return test;
}