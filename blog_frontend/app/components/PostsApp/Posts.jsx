import React, { Component } from 'react';
import { Button } from 'react-toolbox/lib/button';
import { findIndex, set } from 'lodash/fp';
import { fromJS, List } from 'immutable';
import Post from './Post/Post';
import PostForm from './PostForm/PostForm';
import { endpoints } from '../../constants';

class Posts extends Component {

  state = {
    posts: List(),
    showForm: false,
    postToEdit: undefined,
  };

  componentDidMount() {
    this.getPosts();
  }

  async getPosts() {

    const response = await fetch(endpoints.posts);
    const posts = await response.json();
    this.setState({ posts: fromJS(posts) });

  }

  createPost = (post) => {
    fetch(endpoints.posts, {
      method: 'POST',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(post.toJS()),
    });
    this.handleCloseForm();
  };

  editPost = (post) => {

    console.log(post);
    fetch(`${endpoints.posts}/${post.get('id')}`, {
      method: 'PUT',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(post.toJS()),
    });
    this.handleCloseForm();
  };

  editPostForm = (id, post) => {
    this.setState({
      showForm: true,
      postToEdit: post
        .set('id', id)
        .set('updated_at', Date()),
    });
  };


  handleDeletePost = (id) => {
    fetch(`${endpoints.posts}/${id}`, {
      method: 'DELETE',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
    });
    this.handleCloseForm();
  };

  handleShowForm = () => {
    this.setState({ showForm: true });
  };

  handleCloseForm = () => {
    this.setState({ showForm: false, postToEdit: undefined });
    window.location.reload();
  };

  render() {

    const posts = this.state.posts.map(post => (
      <Post
        key={post.get('_id')}
        id={post.get('_id')}
        post={post}
        editPost={this.editPostForm}
        deletePost={this.handleDeletePost}
      />
    )).toJS();



    // const posts = this.state.posts.length > 0 ?
    // (
    //   this.state.posts
    // ) :
    // (
    //   <div>
    //     No hay posts
    //   </div>
    // );

    return (
      <div>
        {posts}
        <PostForm
          active={this.state.showForm}
          createPost={this.createPost}
          editPost={this.editPost}
          closeForm={this.handleCloseForm}
          post={this.state.postToEdit}
        />
        <Button
          icon="add"
          label="Create post"
          onClick={this.handleShowForm}
        />
      </div>
    );
  }

}

export default Posts;