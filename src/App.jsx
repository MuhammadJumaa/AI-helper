import { Backdrop, Button, CircularProgress, IconButton, MenuItem, Modal, Select, Tooltip } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react'

import { Configuration, OpenAIApi } from "openai";

import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { a11yDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import Pre from './components/Pre';

function App() {
  const [question, setQuestion] = useState('');
  const [about, setAbout] = useState('');
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState('');

  const configuration = new Configuration({
    /*********************************************

      Generate a free API key at:
      https://platform.openai.com/account/api-keys

    *********************************************/
    apiKey: "API key",
  });
  const openai = new OpenAIApi(configuration);

  async function getHelp() {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{
        content: question + ` I need it for ${about?about:"javascript"}.`,
        role: 'assistant'
      }],
      max_tokens: 512,
    });

    return response;
  }

  const askForHelp = () => {
    setLoading(true);

    getHelp()
      .then(answer => { setAnswer(answer.data.choices[0].message.content) })
      .catch(err => console.error('Something went wrong!', err))
      .finally(() => setLoading(false));
  }

  return (
    <>
      <div className='controls'>
        <div className='input-box'>
          <label>Your Question
          <input
            onChange={(e) => setQuestion(e.target.value)}
            value={question}
            className='question-input'
          />
          </label>
         
        </div>
        <div className='input-box'>
        <label>I am focusing about
        <Select 
        placeholder='I am focusing about'
        name='about'         
        onChange={(e) => setAbout(e.target.value)}
        className='question-input' fullWidth={true}>
            <MenuItem value={"React"}>React</MenuItem>
            <MenuItem value={"javascript"}>javascript</MenuItem>
            <MenuItem value={"Vue"}>Vue</MenuItem>
            <MenuItem value={"Angular"}>Angular</MenuItem>
            <MenuItem value={"jQuery"}>jQuery</MenuItem>
            <MenuItem value={"php"}>php</MenuItem>
            <MenuItem value={"python"}>python</MenuItem>
          </Select>
          </label>
          </div>
          
        <Button
          disabled={!question}
          variant="contained"
          onClick={() => askForHelp()}>
          Generating AI Answer
        </Button>
        <Tooltip placement='top' title="Clear">
            <span>
              <IconButton
                disabled={!question}
                aria-label="clear"
                onClick={() => setQuestion('')}>                 
                <DeleteIcon />
              </IconButton>
            </span> 
          </Tooltip>
      </div>


      <Modal
        open={Boolean(answer)}
        className='modal'
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="modal-container">
          <div className='modal-content'>
            <ReactMarkdown components={{
              pre: Pre,
              code({ node, inline, className = "blog-code", children, ...props }) {
                return !inline ? (
                  <SyntaxHighlighter
                    style={a11yDark}
                    language='javascript'
                    PreTag='div'
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              }
            }}>
              {answer}
            </ReactMarkdown>
          </div>
          <Button
            onClick={() => setAnswer('')}
            variant="contained"
            className='done-button'>
            Back
          </Button>
        </div>
      </Modal>

      <Backdrop
        sx={{ color: '#F0DB4F', background: '#111', zIndex: '1' }}
        className='backdrop'
        open={loading}
      >
        <CircularProgress color="inherit" />
        <p>Generating Answer</p>
      </Backdrop>
    </>
  )
}

export default App
