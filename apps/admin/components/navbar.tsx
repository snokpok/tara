import styles from './navbar.module.css';
import Link from 'next/link';

const Navbar = () => {
	return (
		<div className={styles.navbar}>
			<div>
				<a className="">insert Tara logo</a>
				<div className="navlinks">
					<ul className={styles.list}>
						<li>
							<Link href="/classes">Classes</Link>
						</li>
						<li>
							<Link href="/analytics">Analytics</Link>
						</li>
						<li>
							<Link href="/settings">Settings</Link>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
};
export default Navbar;
