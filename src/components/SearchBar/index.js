import "./index.css"
import {Component} from "react"


class SearchBar extends Component{
    state={searchInput:"" , searchList:[] , status:"" , dogImg:""}

    onChangeSearch = (event) =>{
        this.setState({searchInput:event.target.value })
    }

    getMoviesApi = async () =>{
        this.setState({status:"INITIAL"})
        const {searchInput} = this.state
        const response = await fetch(`https://openlibrary.org/search.json?q=${searchInput}`)
        const Dogresponse = await fetch("https://dog.ceo/api/breeds/image/random")
        const Dogdata = await Dogresponse.json()
        
        if (response.ok === true){
            
            const data = await response.json()
            const formatData=data.docs.map(each => ({title:each.title,
                key:each.key,
                ratingsAverage:each.ratings_average,
                publishYear:each.publish_year,
                authorName:each.author_name,
                language:each.language}))
            this.setState({ searchInput:"",searchList:formatData , status:"SUCCESS" , dogImg:Dogdata.message})
        }else{
            this.setState({searchInput:"",status:"FAILURE"})
        }
    }

    onSubmitSearch = event=>{
        event.preventDefault()
        this.getMoviesApi()
    }

    renderLoading = () => (
        <div className="loader-container">
          <h1>loading..</h1>
        </div>
      )

    renderFailureView = ()=>(
        <div>
            <h1>Sorry there is no movie , Please try something else</h1>
        </div>
    )

    

    renderCardView = ()=> {
        const {searchList , dogImg} = this.state
        if (searchList.length <1){
            return this.renderFailureView()
        }
        return (
            <ul>
                {searchList.map(  each => 
                    
                    (
                        <li className="list-item" key={each.key}>
                            
                            <img src={dogImg} alt="Dog" className="dog-img" />
                            <div className="column">

                                <p>Title : {each.title}</p>
                                <p>Ratings Average : {each.ratingsAverage}</p>
                                <p>Publish year : {each.publishYear}</p>
                                <p>Author Name : {each.authorName}</p>
                                <p>Language : {each.language}</p>
                            </div>
                        </li>
                    )
                )}
            </ul>
        )
    }

    renderMovies = () =>{
        const {status} = this.state
        switch (status){
            case "INITIAL":
                return this.renderLoading()
            case "SUCCESS":
                return this.renderCardView()
            case "FAILURE":
                return this.renderFailureView()
            default:
                return null
        }
    }

    render(){
        const {searchInput  } = this.state
        return (
            <div className="bg-container" >
                <form className="search-container" onSubmit={this.onSubmitSearch} >
                    <input type="search" className="search" value={searchInput} onChange={this.onChangeSearch} />
                    <button className="search-btn" type="submit" > 
                        Search
                    </button>
                </form>
                    {this.renderMovies()}
                
            </div>
        )
    }
}

export default SearchBar