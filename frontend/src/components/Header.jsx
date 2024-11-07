export default function Header() {
    return (
        <header className="sticky min-h-14 top-0 z-50 bg-black shadow-white border-white border-opacity-20 border-b-[0.009px] w-full flex items-center py-2 justify-between px-16">
            <div className="flex items-center gap-2">
                <img src="src/components/images/logo.png" alt="" width={30} />
                <span className="text-2xl font-bold">
                    NanoShare
                </span>
                <nav>
                    <ul className="flex gap-8 mx-4 text-opacity-80 text-white font-light text-md">
                        <li>Contact</li>
                        <li>About</li>
                        <li>Privacy</li>
                        <li>FAQs</li>
                    </ul>
                </nav>
            </div>
            <button className="bg-white text-black rounded-md text-sm py-1 px-2 font-normal">Transfer now</button>
        </header>
    )
}