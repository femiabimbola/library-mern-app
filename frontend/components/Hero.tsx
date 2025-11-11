import Link from "next/link";

const Hero = () => {
  return (
    <section
      id=""
      className="pb-16 pt-[120px] md:pb-[120px] md:pt-[150px] xl:pb-[160px] xl:pt-[180px] 2xl:pb-[200px]  border border-amber-500"
    >
      <div className="">
        <div className="mx-auto max-w-[900px] text-center">
          <h1 className="mb-5 text-3xl font-bold leading-tight text-black sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight">
            Free and Open-Source Library Management System
          </h1>
          <p className="mb-12 text-base !leading-relaxed text-body-color dark:text-body-color-dark sm:text-lg md:text-xl">
            This project is built to solidify knowledge using the MERN stack in building application. This project uses
            the Express library for backend service and NextJs for the frontend service. Drizzle for ORM and Postgress
            database supplied ny Neon. Shadcn and tailwind CSS to help with the frontend application
          </p>
          <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Link
              href="/books"
              className="rounded-sm bg-primary px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-primary/80"
            >
              🔥 Borrow Books
            </Link>
            <Link
              href="https://github.com/femiabimbola/library-mern-app"
              className="inline-block rounded-sm bg-black px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-black/80"
            >
              Star on GitHub
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
