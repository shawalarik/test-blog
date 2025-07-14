/*

<script setup>
    import {
    VPTeamPage,
    VPTeamPageTitle,
    VPTeamMembers
} from 'vitepress/theme';
    import {onMounted} from "vue";
    import { TkMessage } from "vitepress-theme-teek";


    const members = [
    {
        avatar: '/avatar/avatar.webp',
        name: '威威',
        title: '书以启智 技于谋生',
        links: [
    { icon: 'gitee', link: 'https://gitee.com/dlwwei' },
    { icon: 'qq', link: '' },
    { icon: 'wechat', link: '' }
        ],
        /!*sponsor: '123'*!/
    },
    ];

    onMounted(() => {
    const scene = document.querySelector('.avatar-img').addEventListener('click',()=>{
    TkMessage.primary({showClose: true, message: '你好呀', duration: 2000, plain: true,offset: 80 });
})
});

</script>

<Confetti />
<VPTeamPage>
    <VPTeamPageTitle>
        <template #title>
        关于本站
    </template>
    <template #lead>
    一个兴趣使然的程序员
</template>
</VPTeamPageTitle>
<VPTeamMembers
    :members="members"
    />
    </VPTeamPage>*/
