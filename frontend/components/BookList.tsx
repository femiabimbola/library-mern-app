interface BookProps {
  title: string;
  books: Book[]; //that another inteface
  containerClassName?: string;
}

const BookList = ({ title, books, containerClassName }: BookProps) => {
  return (
    <section>
      <ul className="book-list">
        {books.map((book) => (
          // ...book spreads the property
          // <BookCard key={book.title} {...book} />
          <p>book</p>
        ))}
      </ul>
    </section>
  );
};
