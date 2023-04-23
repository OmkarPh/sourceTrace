import React from 'react';
import Getstarted from '../components/landingpage/getstarted';
import Producerrole from '../components/landingpage/producerrole';
import Warehouserole from '../components/landingpage/warehouserole';
import Footer from '../components/landingpage/footer';
import Retailerrole from '../components/landingpage/retailerrole';


export default function Home() {
  return (
    <>
      <Getstarted/>
      <Producerrole/>
      <Warehouserole/>
      <Retailerrole/>
      <Footer/>

      {/* <div>
        <h1 className="text-3xl font-bold">
          Landing page
        </h1>
        <button onClick={connect}>
          Get started
        </button>
      </div> */}
    </>
  )
}
