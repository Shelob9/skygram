export default function Image({ src, alt }: {
    src: string;
    alt: string;
}){
    return (
        <img
            className="w-full object-cover"
            src={src}
            alt={alt}
        />
    )
}
