<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { icon, title } = context.props
    const vnodes = []

    if (icon) {
      // 修改左侧导航栏图标样式
      const arr = icon.split(' ');
      let color = '';
      if(arr.length === 2) {
        color = arr[1]
      }
      if(icon.includes('el-icon')) {
        vnodes.push(<i class={[ icon, 'sub-el-icon' ]} style={ 'color:' + color }/>);
      } else {
        vnodes.push(<svg icon icon-class={ icon }/>)
      }
      // if (icon.includes('el-icon')) {
      //   vnodes.push(<i class={[icon, 'sub-el-icon']} />)
      // } else {
      //   vnodes.push(<svg-icon icon-class={icon}/>)
      // }
    }

    if (title) {
      vnodes.push(<span slot='title'>{(title)}</span>)
    }
    return vnodes
  }
}
</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>
