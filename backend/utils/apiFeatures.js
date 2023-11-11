class APIFeatures{
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    search(){
        console.log(this.queryStr.keyword);
        const keyword = this.queryStr.keyword ? {
            name : {
                $regex: this.queryStr.keyword,
                $options: 'i' //case insensitive
            }
        } : {

        }

        console.log(keyword)
        this.query = this.query.find({...keyword});
        return this;
    }


    filter(){
        // console.log(this.queryStr);
         const queryCopy = { ...this.queryStr };

        //  console.log(queryCopy);
        const removeFields = ['keyword', 'page', 'limit'];

        removeFields.forEach(el => delete queryCopy[el]);

         // Advance filter for price, ratings etc
         let queryStr = JSON.stringify(queryCopy)
         
         queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)
         console.log(queryStr)
         this.query = this.query.find(JSON.parse(queryStr));
         
        return this;
    }

    pagination(resPerPage){
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resPerPage * (currentPage - 1);

        this.query = this.query.limit(resPerPage).skip(skip);
        return this;
    }
}

module.exports = APIFeatures;