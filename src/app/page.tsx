// import Match from './match/page'
import CreateMatch from './createMatch/page'

export default function Home() {

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-5'>
      <CreateMatch />
      {/* <Match /> */}
    </div>
  );
}
