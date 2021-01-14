import {useDropzone} from 'react-dropzone';
import { useCallback } from 'react'
import './App.css';
import Card from '@material-ui/core/Card';
import axios from 'axios';


//Superagent
const superagent = require('superagent');
 
// callback
superagent
  .post('/api/pet')
  .send({ name: 'Manny', species: 'cat' }) // sends a JSON post body
  .set('X-API-Key', 'foobar')
  .set('accept', 'json')
  .end((err, res) => {
    // Calling the end function will send the request
  });
 
// promise with then/catch
superagent.post('/api/pet').then(console.log).catch(console.error);
  
  
  //dropzone
  export default function Dropzone(props) {

    

    const onDrop = useCallback(files => {
        console.log(files);
    
        const req = axios.post('http://localhost:4000/upload');
    
        files.forEach(file => {
          req.attach('file', file);
        });
        req.end((err, res) => {
          console.log(res)
        });
    
      }, []);

      const {acceptedFiles, getRootProps, getInputProps} = useDropzone({onDrop});

      const files = acceptedFiles.map(file => (
        <li key={file.path}>
          {file.path} - {file.size} bytes
        </li>
      ));


  
    return (
      <Card className="dropcontainer">
        <div {...getRootProps({className: 'dropzone'})}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop some files here, or click to select files</p>
        </div>
        <aside>
          <h4>Files</h4>
          <ul>{files}</ul>
        </aside>
      </Card>
    );
  }