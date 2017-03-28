ebaocloud LI API设计
================
### 基本思路
* #### API设计目的
建立ebaocloud的根本目的和目标，是为了建设一个全行业的基础服务平台，提供保险业的基础服务能力，并且连接行业参与方，赋能行业参与方。同时，在满足安全、稳定、高效等前提下，平台会以极具竞争力的价格提供所有服务。
API是平台对外提供服务能力的载体，API的设计需要体现这一目标。

* #### API设计原则
  * 以 Restful 的形式设计所有的对外API，体现ebaocloud作为一个公共资源所能够对外提供的服务能力。支持GET, PUT, POST 和 DEL四种操作。API设计的时候，不应该加入任何动词，而只应该有资源名称和层级。
  * GET: 获取资源，如果把ebaocloud当成一个公共资源，所有GET操作都是资源获取。GET操作就是获取信息：产品信息，客户信息，建议书信息 ...，
    * ``` GET /products/ ``` ：获取产品列表
    * ``` GET /products/hot;  GET /products/recent ``` ：获取热门、最新产品列表
    * ``` GET /products/id ``` ：获取某一个产品信息
    * ``` GET /prospects/id``` ：获取某一个prospect
    * ``` GET /prospects/id/proposals```：获取某一个prospect下的所有proposal
    * ``` GET /proposals/id``` ：获取某一个proposal，尽可能采用最短路径，而不是 ```GET /prospects/id/proposal/id```
  * POST：创建资源
    * ``` POST /prospects```：创建一个新的prospect，一般需要返回prospect的id信息
    * ``` POST /proposals```：创建一个新的proposal
  * PUT：创建或者更新资源，和POST不同的是，PUT必须是幂等的，因此在使用PUT前，必须确定资源的id
    * ``` PUT /prospects/id``` 创建或者修改某prospect
    * ``` PUT /proposals/id``` 创建或者修改某proposal
  * DELETE：删除资源，DELETE必须是幂等的
    * ``` DELETE /prospects/id``` 删除某prospect
    * ``` DELETE /proposals/id``` 删除某proposal
  * 复杂查询和保费（包括其他费）计算，严格讲都是GET操作，但因为都需要传如大量参数，可以用POST。
    * ```POST /products/calculator/premium```
    * ```POST /products/query```
    * ```POST /products/calculator/validation```
  * Request (TBD)，需要加入auth信息，租户信息
  * Response (TBD)
* #### 需要特别注意的问题
  * 如果从用户角度看，用户是需要获取ebaocloud的计算、连接能力，当然也包括数据（产品库，规则库），因此用户并不关心后台的具体实现，而只关心最后的结果。API设计上要尽可能考虑用户的使用。
  * 用户可以选择部分或者全部使用ebaocloud，或者换而言之，我们并不需要提供所有的功能，满足所有的需求，而是可以逐步渐进的提供。ebaocloud还没有提供的服务，需要客户在本地实现，或者有其他第三方供应商实现。

### 资源域
* #### 产品域（product）
  * 产品域是核心功能，围绕保险产品，提供了相关能力：产品信息获取，产品计算，产品基础校验
  * 产品域的特点是，几乎所有功能都可以通过GET方法提供，同时产品域需要提供“无限”的水平扩展能力

### 用户使用

### 参考
[我所认为的RESTful API最佳实践](http://www.scienjus.com/my-restful-api-best-practices/)
