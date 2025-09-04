const data = await fetch("https://zrbzspge7k.execute-api.eu-north-1.amazonaws.com/default/returnYes")
const object = await data.json()
const items = object.data




export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      
    </main>
  );
}
