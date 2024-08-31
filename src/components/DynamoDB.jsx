import { generateClient } from 'aws-amplify/api';

import { useEffect, useState } from 'react'

import { createTodo } from '../graphql/mutations'
import { listTodos } from '../graphql/queries'

const API = generateClient();

export function DynamoDB () {
  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    fetchTodos()
  }, [])

  async function fetchTodos () {
    try {
      const response = await API.graphql({
        query: listTodos
      })
      const todosData = response.data.listTodos.items
      setTodos(todosData)
    } catch (err) {
      console.log('error fetching books...', err)
    }
  }

  const handleTitleChange = event => {
    setTitle(event.target.value)
  }

  const handleDescriptionChange = event => {
    setDescription(event.target.value)
  }

  const handleSubmit = async event => {
    event.preventDefault()

    try {
      const todoDetails = {
        // owner: '37744ac8-7001-70b3-dd78-ea8dd01b5903',
        title,
        description
      }
      console.log(todoDetails)
      const newTodo = await API.graphql({
        query: createTodo,
        variables: { input: todoDetails },
        authMode: 'userPool'
      })
      console.log('投稿しました。', newTodo)
      alert('投稿に成功しました。')
      fetchTodos()
    } catch (error) {
      console.error('投稿に失敗しました。', error)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input type='text' value={title} onChange={handleTitleChange} />
        </label>
        <br />
        <label>
          Description:
          <input
            type='text'
            value={description}
            onChange={handleDescriptionChange}
          />
        </label>
        <br />
        <button type='submit'>Create Post</button>
      </form>
      <ol>
        {todos.map(todo => (
          <li key={todo.id}>
            <p>
              title={todo.title}, description={todo.description}
            </p>
          </li>
        ))}
      </ol>
    </div>
  )
}
