import Link from 'next/link';

export default function Header() {
    return (
        <header className="bg-white shadow-md">
            <div className="max-w-4xl mx-auto p-4 flex justify-between items-center">
                <Link href="/" legacyBehavior>
                    <a className="text-2xl font-bold text-black-600">Philosophist</a>
                </Link>
                <Link href="/fallacies" legacyBehavior>
                    <a className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">誤謬一覧</a>
                </Link>
            </div>
        </header>
    );
}
