interface BookProps {
  title: string;
  books: Book[]; //that another inteface
  containerClassName?: string;
}

const BookList = ({ title, books, containerClassName }: BookProps) => {
  return (
    <section>
      <h2 className="font-bebas-neue text-4xl text-light-100">{title}</h2>
      <ul className="book-list">
        {books.map((book) => (
          // <BookCard key={book.title} {...book} />
          <p>book</p>
        ))}
      </ul>
    </section>
  );
};
