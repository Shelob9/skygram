export default function AsideSection({ title, children }: { title: string; children: React.ReactNode }) {

    return(
        <div className="mt-14 ml-10 border rounded p-4">
            <h2 className="text-lg">{title}</h2>
            {children}
        </div>
    )
}
