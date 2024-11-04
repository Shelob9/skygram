
type StoryProps = {
    img: string;
    username: string;
}


function Story({ img, username }: StoryProps) {
    return (
        <div className="cursor-pointer relative group">
                <img
                    src="https://static.skillshare.com/uploads/users/350301760/user-image-large.jpg?753816048"
                    className="h-14 w-14 rounded-full p-[1.5px] border-2 border-red-500 group-hover:scale-110 transition-transform duration-200 ease-out"
                />

                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 absolute top-4 left-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 4v16m8-8H4"
                    />
                </svg>

                <p className="text-xs w-14 truncate text-center">codewithsahand</p>
            </div>
    )
}
export default function Stories() {
    return (
        <div
            className="flex space-x-2 p-6 border overflow-x-scroll scrollbar-none rounded-sm"
        >
            <div className="cursor-pointer relative group">
                <img
                    src="https://static.skillshare.com/uploads/users/350301760/user-image-large.jpg?753816048"
                    className="h-14 w-14 rounded-full p-[1.5px] border-2 border-red-500 group-hover:scale-110 transition-transform duration-200 ease-out"
                />

                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 absolute top-4 left-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 4v16m8-8H4"
                    />
                </svg>

                <p className="text-xs w-14 truncate text-center">codewithsahand</p>
            </div>
            <div className="cursor-pointer">
            <img
                src="https://i.pravatar.cc/150?img=1"
                className="h-14 w-14 rounded-full p-[1.5px] border-2 border-red-500 hover:scale-110 transition-transform duration-200 ease-out"
            />
            <p className="text-xs w-14 truncate text-center">Amorepead1944</p>
            </div>
            <div className="cursor-pointer">
            <img
                src="https://i.pravatar.cc/150?img=2"
                className="h-14 w-14 rounded-full p-[1.5px] border-2 border-red-500 hover:scale-110 transition-transform duration-200 ease-out"
            />
            <p className="text-xs w-14 truncate text-center">Berman</p>
            </div>
            <div className="cursor-pointer">
            <img
                src="https://i.pravatar.cc/150?img=3"
                className="h-14 w-14 rounded-full p-[1.5px] border-2 border-red-500 hover:scale-110 transition-transform duration-200 ease-out"
            />
            <p className="text-xs w-14 truncate text-center">Wevell36</p>
            </div>
            <div className="cursor-pointer">
                <img
                    src="https://i.pravatar.cc/150?img=4"
                    className="h-14 w-14 rounded-full p-[1.5px] border-2 border-red-500 hover:scale-110 transition-transform duration-200 ease-out"
                />
                <p className="text-xs w-14 truncate text-center">Wough1971</p>
            </div>
            <div className="cursor-pointer">
                <img
                    src="https://i.pravatar.cc/150?img=5"
                    className="h-14 w-14 rounded-full p-[1.5px] border-2 border-red-500 hover:scale-110 transition-transform duration-200 ease-out"
                />
                <p className="text-xs w-14 truncate text-center">Ovion1943</p>
            </div>
            <div className="cursor-pointer">
                <img
                    src="https://i.pravatar.cc/150?img=6"
                    className="h-14 w-14 rounded-full p-[1.5px] border-2 border-red-500 hover:scale-110 transition-transform duration-200 ease-out"
                />
                <p className="text-xs w-14 truncate text-center">Unessight</p>
            </div>
            <div className="cursor-pointer">
            <img
                src="https://i.pravatar.cc/150?img=7"
                className="h-14 w-14 rounded-full p-[1.5px] border-2 border-red-500 hover:scale-110 transition-transform duration-200 ease-out"
            />
            <p className="text-xs w-14 truncate text-center">Nowassained</p>
            </div>
            <div className="cursor-pointer">
            <img
                src="https://i.pravatar.cc/150?img=8"
                className="h-14 w-14 rounded-full p-[1.5px] border-2 border-red-500 hover:scale-110 transition-transform duration-200 ease-out"
            />
            <p className="text-xs w-14 truncate text-center">Freg1969</p>
            </div>
            <div className="cursor-pointer">
            <img
                src="https://i.pravatar.cc/150?img=9"
                className="h-14 w-14 rounded-full p-[1.5px] border-2 border-red-500 hover:scale-110 transition-transform duration-200 ease-out"
            />
            <p className="text-xs w-14 truncate text-center">Ushe1969</p>
            </div>
            <div className="cursor-pointer">
            <img
                src="https://i.pravatar.cc/150?img=10"
                className="h-14 w-14 rounded-full p-[1.5px] border-2 border-red-500 hover:scale-110 transition-transform duration-200 ease-out"
            />
            <p className="text-xs w-14 truncate text-center">Onstonly1976</p>
            </div>
            <div className="cursor-pointer">
            <img
                src="https://i.pravatar.cc/150?img=11"
                className="h-14 w-14 rounded-full p-[1.5px] border-2 border-red-500 hover:scale-110 transition-transform duration-200 ease-out"
            />
            <p className="text-xs w-14 truncate text-center">Cleakettent</p>
            </div>
            <div className="cursor-pointer">
            <img
                src="https://i.pravatar.cc/150?img=12"
                className="h-14 w-14 rounded-full p-[1.5px] border-2 border-red-500 hover:scale-110 transition-transform duration-200 ease-out"
            />
            <p className="text-xs w-14 truncate text-center">Foldishow</p>
            </div>
            <div className="cursor-pointer">
            <img
                src="https://i.pravatar.cc/150?img=13"
                className="h-14 w-14 rounded-full p-[1.5px] border-2 border-red-500 hover:scale-110 transition-transform duration-200 ease-out"
            />
            <p className="text-xs w-14 truncate text-center">Pith2000</p>
            </div>
            <div className="cursor-pointer">
            <img
                src="https://i.pravatar.cc/150?img=14"
                className="h-14 w-14 rounded-full p-[1.5px] border-2 border-red-500 hover:scale-110 transition-transform duration-200 ease-out"
            />
            <p className="text-xs w-14 truncate text-center">Amorepead1944</p>
            </div>
        </div>
    )
}
