import axios from "axios";

const Books = async () => {
  const BookFetcher = async (url: string) => {
    const response = await axios.get(url);
    return response.data;
  };

  return (
    <section
      className="my-auto flex h-full min-h-screen flex-1 items-center bg-pattern bg-cover bg-top 
    0 px-5 py-10"
    >
      <p>hey</p>
    </section>
  );
};

export default Books;
