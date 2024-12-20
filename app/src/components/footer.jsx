import Image from "next/image";

const Footer = () => {
    return ( <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://data.dev.sennetconsortium.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="World"
            width={16}
            height={16}
          />
          SenNet
        </a>
      </footer>
    )
}
export default Footer