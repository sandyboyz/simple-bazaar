import Head from 'next/head'
// import Path, { resolve } from 'path';
import Axios from 'axios';
import Fse from 'fs-extra';
import { LazyLoadImage } from 'react-lazy-load-image-component';


export default function Home(props) {
  // console.log(props)
  return (
    <React.Fragment>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <div className='container m-auto mt-4 '>
          <h1 className='text-4xl font-bold tracking-wide font-sans text-gray-800 mb-4'>
            Welcome to Bazaar
          </h1>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            {props.posts.map(val => {
              return <div key={val.id} className='bg-white rounded shadow-md p-4'>
                <div>
                  <div>
                    <LazyLoadImage 
                    
                    alt={val.image.url}
                    src={`/${val.image.url}`}
                    // effect="blur"
                    // delayMethod={'throttle'}
                    // delayTime={2000}
                    // height='56px'
                    // width='100%'
                    style={{height: '14rem', width: '100%'}}
                    // wrapperClassName='rounded-lg'
                    // className='rounded-lg h-56 w-fuull'
                    />
                  </div>
                  {/* <img className='rounded-lg h-56 w-full' src={`/${val.image.url}`}/> */}

                </div>
                <div className='p-3'>
                 <p className='text-2xl'>{val.title}</p>
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
  const res = await fetch('https://wawo-bazaar.herokuapp.com/products');
  const posts = await res.json();

  async function downloadImage (uri) {  
    const url = `https://wawo-bazaar.herokuapp.com${uri}`;
    // const path = Path.resolve('./')
    const imageName = uri.replace(/.+\/(.+?\.jpeg$)/, '$1');

    const exists = await new Promise(resolve => Fse.access(`public/${imageName}`, err => {
      if (err) resolve(0);
      else resolve(1);
    }));

    if (exists) return;
    

    const writer = Fse.createWriteStream(`./public/${imageName}`);
  
    const response = await Axios({
      url,
      method: 'GET',
      responseType: 'stream'
    })
    
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
      writer.on('finish', resolve)
      writer.on('error', reject)
    })
  }

  await Promise.all(posts.map(val => {
    return downloadImage(val.image.url);
  }));
  
  const cdnImages = posts.map(val => val.image.url.replace(/.+\/(.+?\.jpeg$)/, '$1'));
  const file = (await Fse.readdir('./public')).filter(val => /\.(jpeg|jpg)$/.test(val) && !cdnImages.includes(val));

  await Promise.all(file.map(val => {
    return Fse.remove(`./public/${val}`);
  }));

  return {
    props: {
      posts: posts.map(val => {
        return {
          ...val,
          image: {
            ...val.image,
            url: val.image.url.replace(/.+\/(.+?\.jpeg$)/, '$1')
          }
        }
      }),
    },
  }
}
