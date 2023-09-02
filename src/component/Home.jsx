import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './home1.css'

function Home() {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(
          `https://hacker-news.firebaseio.com/v0/jobstories.json`
        );

        const jobIds = response.data.slice((page - 1) * 6, page * 6);

        const jobPromises = jobIds.map(async (jobId) => {
          const jobResponse = await axios.get(
            `https://hacker-news.firebaseio.com/v0/item/${jobId}.json`
          );
          return jobResponse.data;
        });

        const jobData = await Promise.all(jobPromises);
        setJobs((prevJobs) => [...prevJobs, ...jobData]);
      } catch (error) {
        console.error('Error fetching job data:', error);
      }
    };

    fetchJobs();
  }, [page]);



  return (
    <div>
        
        <div className="topnav">
  <a className="active" href="#home">Home</a>
  <a href="#news">News</a>
  <a href="#contact">Contact</a>
  <a href="#about">About</a>
</div>
        
        <div className='header'>
            <h1>HACKER NEWS JOBS BOARD</h1>
        </div>
      {jobs.map((job) => (
        <div key={job.id} className='container'>
          {job.url ? (
            <a href={job.url} target="_blank" rel="noopener noreferrer">
              {job.title}
            </a>
          ) : (
            <span>{job.title}</span>
          )}
          <p>Posted by {job.by} on {new Date(job.time * 1000).toLocaleDateString()}</p>
        </div>
      ))}
      <button onClick={() => setPage(page + 1)}>Load More</button>
    </div>
  );
}

export default Home;
