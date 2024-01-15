import axios from 'axios'

export default {
  options: (h, conf, key)=> {
    if(conf.remote) {
      conf.remoteMethod =(query)=> {

        axios.get(conf.__config__.url, {
          params: {
            keywords: query
          }
        })
          .then(function (response) {
            if(response.data && response.data.code === 200) {
              conf.options = response.data.data
            }
          })
          .catch(function (error) {
            console.log(error, '==========');
          });

      }
    }

    const list = []
    conf.options.forEach(item => {
      list.push(<el-option label={item.label} value={item.value} disabled={item.disabled}></el-option>)
    })
    return list
  }
}
