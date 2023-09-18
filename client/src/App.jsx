import { useEffect, useState } from 'react'
import './App.css'
import toast, { Toaster } from 'react-hot-toast';
import axios from "axios"

function App() {
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [searchVal, setSearch] = useState("")
  const [data, setData] = useState([])
  const [updateTitle, setUpdateTitle] = useState("")
  const [updateBody, setUpdateBody] = useState("")

  useEffect(() => {
    getAllStories()
  }, [])
  const getAllStories = () => {
    axios.get("http://localhost:3000/api/v1/posts").then((data) => {
      setData(data.data.data)
    }).catch((err) => {
      console.log(err);
    })
  }
  const deletePost = (id) => {
    axios.delete("http://localhost:3000/api/v1/post/" + id).then((data) => {
      toast.success("Post Deleted Successfully!")
      getAllStories()
    }).catch((err) => {
      console.log(err);
    })
  }
  const postData = async (e) => {
    e.preventDefault()
    try {
      await axios.post("http://localhost:3000/api/v1/post", {
        title,
        body
      })
      getAllStories()
      toast.success("Created Post Successfully!")
      setTitle("")
      setBody("")
    } catch (error) {
      console.log(error);
    }
  }
  const search = async (e) => {
    e.preventDefault()
    try {
      axios.get("http://localhost:3000/api/v1/search/?q=" + searchVal)
        .then((data) => {
          setData(data.data.data)
          setSearch("")
        })
    } catch (error) {
      console.log(error);
    }
  }
  const updatePost = (e, id, index) => {
    e.preventDefault()
    axios.put("http://localhost:3000/api/v1/post/" + id, {
      title: updateTitle,
      body: updateBody
    }).then((data) => {
      toast.success("Post Updated Successfully!")
      getAllStories()
    }).catch((err) => {
      console.log(err);
    })
  }

  return (
    <>
      <div className="navbar">
        <h1 className="logo">
          SocialPosts
        </h1>
        <form onSubmit={(e) => search(e)} className="input-search">
          <input type="search" onChange={(e) => setSearch(e.target.value)} value={searchVal} placeholder='Search.....' />
        </form>
      </div>
      <form onSubmit={(e) => postData(e)} className="dashboard">
        <div className="input-label">
          <label htmlFor="title">Title</label>
          <input placeholder='Enter Title' onChange={(e) => { setTitle(e.target.value) }} value={title} type="text" name="title" id="title" />
        </div>
        <div className="input-label">
          <label htmlFor="body">Body</label>
          <input placeholder='Enter Body' onChange={(e) => { setBody(e.target.value) }} value={body} type="text" name="body" id="body" />
        </div>
        <button type='submit'>Create Post</button>
      </form>
      <h1 className="heading">
        Recent Posts
      </h1>
      <div className="main">
        {
          data.map((item, index) => {
            return ((item.isEdit) ? (<form onSubmit={(e) => updatePost(e, item._id, index)} className="card" key={index}>
              <input placeholder='Update Title' onChange={(e) => setUpdateTitle(e.target.value)} value={updateTitle} />
              <textarea placeholder='Update Body' onChange={(e) => setUpdateBody(e.target.value)} value={updateBody}>{item.body}</textarea>
              <div className="buttons">
                <button type='submit'>Update</button>
                <button onClick={() => {
                  data[index].isEdit = false;
                  setData([...data]);
                }}>Cancel</button>
              </div>
            </form>
            ) : (<div className="card" key={index}>
              <h1>{item.title}</h1>
              <p>{item.body}</p>
              <div className="buttons">
                <button onClick={() => {
                  data[index].isEdit = true;
                  setData([...data]);
                }}>Edit</button>
                <button onClick={() => deletePost(item._id)}>Delete</button>
              </div>
            </div>))


          })
        }
      </div >
      <Toaster />
    </>
  )
}

export default App
