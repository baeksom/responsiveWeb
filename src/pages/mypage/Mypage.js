import React, { useEffect, useState } from "react";
import styles from './mypage.module.css';
import MypageMenu from "../../component/mypageMenu/MypageMenu";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import PostList from "../../component/postList/PostList";

function Mypage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const posts = searchParams.get('posts'); // 작성한글(written), 투표한글(voted), 좋아요한글(liked)

    const [postList, setPostList] = useState([]);
    const [activeMenu, setActiveMenu] = useState('written');
    const [isChecked, setIsChecked] = useState(false);
    const [profileImage, setProfileImage] = useState('/assets/user.png');
    const [title, setTitle] = useState('새싹');
    const [memberInfo, setMemberInfo] = useState(null);

    useEffect(() => {
        const fetchMemberInfo = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_SERVER_IP}/mypage`, {
                    withCredentials: true
                });
                if (response.data.isSuccess) {
                    setMemberInfo(response.data.result);
                } else {
                    console.error(response.data.message);
                }
            } catch (error) {
                console.error("Error fetching member info:", error);
                console.error("개인정보를 불러오는 데 실패했습니다.");
            }
        };

        fetchMemberInfo();
    }, []);

    useEffect(() => {
        const handlefetchPosts = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_SERVER_IP}/mypage`, {
                    params: {
                        posts: posts ? posts : 'written',
                    },
                    withCredentials: true,
                });
                console.log(response.data.result);
                setPostList(response.data.result.postList);
                if (response.data.result.title) {
                    setTitle(response.data.result.title);
                }
            } catch (error) {
                console.error(error);
            }
        };

        handlefetchPosts();
    }, [posts]);

    const handleImageUpload = (e) => {
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);

        return new Promise((resolve) => {
            reader.onload = () => {
                setProfileImage(reader.result);
                resolve();
            };
        });
    };

    const handleChangeTitle = async () => {
        try {
            const response = await axios.put(`${process.env.REACT_APP_SERVER_IP}/mypage/title`, {
                title: "변경된 칭호"
            }, {
                withCredentials: true
            });

            if (response.data.isSuccess && response.data.code === "2000") {
                setTitle("변경된 칭호");
            } else {
                console.error("칭호 변경 실패:", response.data.message);
            }
        } catch (error) {
            console.error("칭호 변경 중 오류:", error);
        }
    };

    const handleMenu = (menu) => {
        setActiveMenu(menu);
        searchParams.set('posts', menu);
        navigate(`?${searchParams.toString()}`);
    }

    const handleMorePost = () => {
        if (posts === 'voted') {
            navigate('/mypage/vote');
        } else if (posts === 'liked') {
            navigate('/mypage/liked');
        } else {
            navigate('/mypage/posting');
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.pc_mypage}>
                <section className={styles.sidebar_wrap}>
                    <MypageMenu active={1} />
                </section>
                <section className={styles.content}>
                    <div className={styles.main}>
                        <div className={styles.mypage}>마이페이지</div>
                        {memberInfo && (
                            <div className={styles.profile}>
                                <div className={styles.imagebox}>
                                    <div className={styles.image}>
                                        <img src={memberInfo.userImg} alt="프로필" />
                                    </div>
                                    <div className={styles.namebox}>
                                        <div>
                                            <div className={styles.title} style={{color: memberInfo.memberTitle? '#354edd' : '#bbbbbb'}}>{memberInfo.memberTitle?memberInfo.memberTitle: '칭호없음'}</div>
                                            <button onClick={handleChangeTitle}>변경</button>
                                        </div>
                                        <span>{memberInfo.nickname} </span>님
                                    </div>
                                </div>
                                <div className={styles.userinfo}>보유칭호 <span>{memberInfo.titleCnt}개</span></div>
                                <div className={styles.userinfo}>포인트 <span>{memberInfo.point}점</span></div>
                            </div>
                        )}
                        <div className={styles.posting}>
                            <div className={styles.menu}>
                                <span onClick={() => handleMenu('written')} className={activeMenu === 'written' ? styles.active : styles.inactive}>작성한 글</span>
                                <span onClick={() => handleMenu('voted')} className={activeMenu === 'voted' ? styles.active : styles.inactive}>투표한 글</span>
                                <span onClick={() => handleMenu('liked')} className={activeMenu === 'liked' ? styles.active : styles.inactive}>좋아요한 글</span>
                            </div>
                            <table className={styles.post_container}>
                                <tbody>
                                    {postList && postList.map((post, idx) =>
                                    (
                                        <tr className={styles.post_wrap} key={idx}>
                                            <td><PostList post={post} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className={styles.plus_wrap}>
                                <button className={styles.plus} onClick={handleMorePost}>더보기</button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <div className={styles.mobile_mypage}>
                <section className={styles.topbar_wrap}>
                    <MypageMenu active={1} />
                </section>
                <section className={styles.content}>
                    <div className={styles.main}>
                        {memberInfo && (
                            <div className={styles.profile}>
                                <div className={styles.imagebox}>
                                    <div className={styles.image}>
                                        <img src={memberInfo.userImg} alt="프로필" />
                                    </div>
                                    <div className={styles.namebox}>
                                        <div>
                                            <div className={styles.title} style={{color: memberInfo.memberTitle? '#354edd' : '#bbbbbb'}}>{memberInfo.memberTitle?memberInfo.memberTitle: '칭호없음'}</div>
                                            <button onClick={handleChangeTitle}>변경</button>
                                        </div>
                                        <span>{memberInfo.nickname} </span>님
                                    </div>
                                </div>
                                <div className={styles.userinfo}>보유칭호 <span>{memberInfo.titleCnt}개</span></div>
                                <div className={styles.userinfo}>포인트 <span>{memberInfo.point}점</span></div>
                            </div>
                        )}
                        <div className={styles.posting}>
                            <div className={styles.menu}>
                                <span onClick={() => handleMenu('written')} className={activeMenu === 'written' ? styles.active : styles.inactive}>작성한 글</span>
                                <span onClick={() => handleMenu('voted')} className={activeMenu === 'voted' ? styles.active : styles.inactive}>투표한 글</span>
                                <span onClick={() => handleMenu('liked')} className={activeMenu === 'liked' ? styles.active : styles.inactive}>좋아요한 글</span>
                            </div>
                            <table className={styles.post_container}>
                                <tbody>
                                    {postList && postList.map((post, idx) =>
                                    (
                                        <tr className={styles.post_wrap} key={idx}>
                                            <td><PostList post={post} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className={styles.plus_wrap}>
                                <button className={styles.plus} onClick={handleMorePost}>더보기</button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default Mypage;
