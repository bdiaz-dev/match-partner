import Match from './match/page'
// import MatchCreate from './matchCreate/page'

export default function Home() {

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-5'>
      {/* <MatchCreate /> */}
      <Match />
    </div>
  );
}
