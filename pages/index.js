import Head from 'next/head'

export default function Home(props) {
  console.log(props)
  return (
    <React.Fragment>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <div className='container m-auto mt-4'>
          <h1 className='text-4xl font-bold tracking-wide font-sans text-gray-800 mb-4'>
            Welcome to Bazaar
          </h1>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            {props.posts.map(val => {
              return <div key={val.id} className='bg-white rounded shadow-md p-4'>
                <div>
                  <img className='rounded-lg h-56 w-full' src={`http://localhost:1337${val.image.url}`}/>

                </div>
                <div className='p-3'>
                 <p className='text-2xl'>{val.name}</p>
                 <p className='text-lg text-gray-800'>Rp. {val.harga.toLocaleString('id-ID')}</p>

                </div>
              </div>
            })}
            {/* <div className='bg-red-200'>
              <img />
            </div>
            <div className='bg-red-200'>
              Wawo
            </div>
            <div className='bg-red-200'>
              Wawo
            </div>
            <div className='bg-red-200'>
              Wawo
            </div> */}

        </div>
        </div>

      </div>
    </React.Fragment>
     
  )
}

export async function getStaticProps() {
  // Call an external API endpoint to get posts
  const res = await fetch('http://localhost:1337/foods');
  const posts = await res.json();

  // By returning { props: posts }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      posts,
    },
  }
}
